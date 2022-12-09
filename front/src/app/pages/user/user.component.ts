import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs';
import IUser from 'src/app/interfaces/IUser';
import { UserService } from 'src/app/service/user.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements AfterViewInit {

  @ViewChild(MatPaginator)
  paginator: MatPaginator
  userList: IUser[]
  searchText: string = "";

  length = 50;
  pageSize = 6;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = true;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

  constructor(private userService: UserService) {
    this.userService.userChanged.subscribe(() => this.getUserList())
  }

  ngAfterViewInit(): void {
    this.searchText = ""
    this.paginator.page
      .pipe(
        tap(() => { this.getUserList() })
      )
      .subscribe()
    this.getUserList();
  }


  onSearchTextEntered(searchValue: string) {
    this.searchText = searchValue
    this.paginator.pageIndex = 0;
    this.getUserList()
  }

  getUserList() {
    this.userService.getByUsernameLike(this.searchText, this.paginator.pageSize, this.paginator.pageIndex)
      .subscribe(data => {
        this.paginator.length = data.totalElements
        this.userList = data.content
      })
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.userService.getByUsernameLike(this.searchText, this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.userList = data.content

        this.length = data.totalPages;
        this.pageSize = data.size;
        this.pageIndex = data.number;
      })
  }
}
